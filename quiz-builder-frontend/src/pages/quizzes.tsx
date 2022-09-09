import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlusSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Button from '../components/button/button';
import Confirm from '../components/confirm/confirm';
import Modal from '../components/modal/modal';
import Pagination from '../components/pagination/pagination';
import Spinner from '../components/spinner/spinner';
import Table from '../components/table/table';
import { Quiz, useQuizContext } from '../context/quiz-context';
import quizService from '../services/quiz.service';

function Quizzes() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('height')) || 10;
  const { quizzes, total, setQuizzes, setTotal } = useQuizContext();
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingQuizCount, setLoadingQuizCount] = useState(false);
  const loading = loadingQuizzes || loadingQuizCount;
  const [isConfirmOpened, setIsConfirmOpened] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const pageCount = useMemo(() => {
    return Math.ceil(total / perPage);
  }, [total, perPage]);

  const getQuizzes = useCallback(async () => {
    setLoadingQuizzes(true);

    try {
      const { data: quizzes } = await quizService.getQuizzes({ page, perPage });

      setQuizzes(quizzes);
      setLoadingQuizzes(false);
    } catch (err) {
      toast.error('An error occurred while getting the quizzes');
      setLoadingQuizzes(false);
    }
  }, [page, perPage, setQuizzes]);

  useEffect(() => {
    getQuizzes();
  }, [getQuizzes]);

  useEffect(() => {
    setLoadingQuizCount(true);

    const getQuizCount = async () => {
      try {
        const { data: totalCount } = await quizService.getQuizCount();

        setTotal(totalCount);
        setLoadingQuizCount(false);
      } catch (err) {
        toast.error('An error occurred while getting the count of quizzes');
        setLoadingQuizCount(false);
      }
    };

    getQuizCount();
  }, [setTotal]);

  const handleChangePage = (page: number) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: page.toString(),
    });
  };

  const handleRemoveQuiz = (quiz: Quiz) => () => {
    setIsConfirmOpened(true);
    setSelectedQuiz(quiz);
  };

  const handleUpdateQuiz = (quiz: Quiz) => () => {
    navigate(`${quiz._id}/edit`);
  };

  const handlePublishQuiz = (quiz: Quiz) => async () => {
    setLoadingQuizzes(true);

    try {
      await quizService.publishQuiz(quiz);
      await getQuizzes();
      setLoadingQuizzes(false);
      toast.success('Published successfully');
    } catch {
      setLoadingQuizzes(false);
      toast.error('An error occurred while publishing the quiz');
    }
  };

  const handleConfirmRemoveQuiz = async () => {
    if (selectedQuiz) {
      setLoadingQuizzes(true);

      try {
        await quizService.deleteQuiz(selectedQuiz);
        await getQuizzes();
        setLoadingQuizzes(false);
        toast.success('Removed successfully');
      } catch (err) {
        setLoadingQuizzes(false);
        toast.error('An error occurred while removing the quiz');
      }
    }
  };

  const toggleConfirm = () => {
    setIsConfirmOpened(isConfirmOpened => !isConfirmOpened);
  };

  const handleAddQuiz = () => {
    navigate('add');
  };

  return (
    <section className="container page-container page-search">
      <Spinner visible={loading} />

      <div className="page-header">
        <h2>Quizzes</h2>

        <div className="sub-header">
          <p>
            {total} {total === 1 ? 'result' : 'results'}
          </p>

          <div>
            <Button onClick={handleAddQuiz}>
              <FontAwesomeIcon icon={faPlusSquare} className="preicon" /> Add Quiz{' '}
            </Button>
          </div>
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Permalink</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quizzes && quizzes.length > 0 ? (
            quizzes.map(quiz => {
              const published = !!quiz.permalink;

              return (
                <tr key={quiz._id}>
                  <td className="fixed-long-text">{quiz.title}</td>
                  <td width="180">
                    {published ? (
                      <a href={`quizzes/public/${quiz.permalink}`}>{quiz.permalink}</a>
                    ) : (
                      <Button className="button" onClick={handlePublishQuiz(quiz)}>
                        Publish
                      </Button>
                    )}
                  </td>
                  <td width="200">
                    <div className="button-group">
                      {!published && (
                        <Button className="button" onClick={handleUpdateQuiz(quiz)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                      )}

                      <Button className="button" onClick={handleRemoveQuiz(quiz)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="text-center" colSpan={3}>
                No results
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination
        total={pageCount}
        page={page}
        onChangePage={handleChangePage}
        buttonAs={Button}
      />

      <Modal isOpened={isConfirmOpened} toggle={toggleConfirm}>
        <Confirm
          title="Delete Quiz"
          description={`Do you really want to delete this quiz?`}
          onOk={handleConfirmRemoveQuiz}
          toggle={toggleConfirm}
        />
      </Modal>
    </section>
  );
}

export default Quizzes;
